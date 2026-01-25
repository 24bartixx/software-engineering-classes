import {expect, request, test} from '@playwright/test';
import {ExpiredBelbinTest} from "../src/types/belbin";

const backendUrl = 'http://localhost:3000';

async function getExpiredTest() {
    const apiContext = await request.newContext({ baseURL: backendUrl });
    const response = await apiContext.get('/belbin/expired');
    if (!response.ok()) throw new Error(`Błąd API: ${response.status()} ${response.statusText()}`);
    const tests: ExpiredBelbinTest[] = await response.json();
    if (tests.length === 0) throw new Error(`Brak przeterminowanych testów Belbina`);
    return tests[0];
}

test.describe('PU: Przeterminowane Testy i Przypomnienia', () => {

    test('TC-BELBIN-EXPIRED: Lista i wysłanie przypomnienia', async ({ page }) => {
        await page.goto('/hr/belbin/expired');
        await expect(page.getByRole('heading', { name: 'Przeterminowane Testy Belbina' })).toBeVisible();
        const enabledRemindButton = page.locator('button', { hasText: 'Wyślij przypomnienie' }).first();

        if (await enabledRemindButton.isVisible()) {
            await enabledRemindButton.click();
            await expect(page.getByText('Wysłano pomyślnie powiadomienie')).toBeVisible();

            const sentButton = page.locator('button', { hasText: 'Przypomnienie wysłane' }).first();
            await expect(sentButton).toBeVisible();
            await expect(sentButton).toBeDisabled();
        }
    });

    test('TC-BELBIN-EXPIRED: Przejście do podglądu (Extend) i blokada wysłania powiadomienia', async ({ page }) => {
        const expiredBelbinTest: ExpiredBelbinTest = await getExpiredTest();
        await page.route(`${backendUrl}/belbin/expired`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{
                    ...expiredBelbinTest,
                    isReminderBlocked: true,
                }]),
            });
        });

        await page.goto('/hr/belbin/expired');
        await expect(page.getByRole('heading', { name: 'Przeterminowane Testy Belbina' })).toBeVisible();
        const dashboardReminderButton = page.getByRole('button', { name: 'Przypomnienie wysłane' }).first()
        await expect(dashboardReminderButton).toBeVisible();
        await expect(dashboardReminderButton).toBeDisabled();
        const viewButton = page.getByRole('button', { name: 'Zobacz test' }).first();
        await viewButton.click();

        await expect(page).toHaveURL(`/hr/belbin/results/${expiredBelbinTest.employeeId}`);

        await expect(page.getByText('Role zespołowe pracownika')).toBeVisible();
        await expect(page.getByText('Szczegółowe wyniki')).toBeVisible();

        await expect(page.getByText('Test wygasa wkrótce lub jest przeterminowany? Wyślij przypomnienie.')).toBeVisible();
        const reminderButton = page.getByRole('button', { name: 'Przypomnienie wysłane lub test ważny' }).first()
        await expect(reminderButton).toBeVisible();
        await expect(reminderButton).toBeDisabled();
    });

    test('TC-BELBIN-EXPIRED: Obsługa błędu wysyłania powiadomienia (Symulacja 500)', async ({ page }) => {
        const expiredBelbinTest: ExpiredBelbinTest = await getExpiredTest();
        await page.route(`${backendUrl}/belbin/expired`, async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{
                    ...expiredBelbinTest,
                    isReminderBlocked: false,
                }]),
            });
        });

        await page.route('**/belbin/notify/expired/**', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: "Błąd serwera pocztowego" })
            });
        });

        await page.goto('/hr/belbin/expired');
        await expect(page.getByRole('heading', { name: 'Przeterminowane Testy Belbina' })).toBeVisible();

        const remindButton = page.locator('button', { hasText: 'Wyślij przypomnienie' }).first();
        await expect(remindButton).toBeVisible();
        await expect(remindButton).toBeEnabled();

        await remindButton.click();

        await expect(page.getByText('Błąd serwera pocztowego')).toBeVisible();

        await expect(remindButton).toBeVisible();
        await expect(remindButton).toBeEnabled();
        await expect(remindButton).toHaveText('Wyślij przypomnienie');
    });
});