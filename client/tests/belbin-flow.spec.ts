import { test, expect, request, Page } from '@playwright/test';
import {BelbinTestStatus} from "../src/types/belbin";

async function completeSection(page: Page, isLastSection: boolean = false) {
    const firstPlusButton = page.getByRole('button', { name: '+' }).first();
    for (let i = 0; i < 10; i++) {
        await firstPlusButton.click();
    }

    await expect(page.getByText('Pozostało punktów: 0').first()).toBeVisible();

    if (isLastSection) {
        await page.getByRole('button', { name: 'Zakończ Test' }).click();
    } else {
        await page.getByRole('button', { name: 'Dalej' }).click();
    }
}

test.describe('PU: Zrób Test Belbina (wymaga pracownika z testem do wykonania)', () => {
    let employeeId: number;

    test.beforeAll(async () => {
        const backendUrl = 'http://localhost:3000';
        const apiContext = await request.newContext({ baseURL: backendUrl });
        const response = await apiContext.get('/belbin/info');
        if (!response.ok()) throw new Error(`Błąd API: ${response.status()} ${response.statusText()}`);
        const employees = await response.json();
        const freshEmployee = employees.find((e: any) => e.status !== BelbinTestStatus.COMPLETED);
        if (!freshEmployee) {
            throw new Error('Brak pracowników z możliwym testem do wykonania w bazie! Zresetuj bazę danych.');
        }
        employeeId = freshEmployee.id;
        console.log(`Test będzie wykonywany dla pracownika o ID: ${employeeId}`);
    });


    test('TC-BELBIN-DO-001: Poprawne wypełnienie testu i wyświetlenie wyników', async ({ page }) => {
        await page.goto(`/belbin/test/${employeeId}`);
        await expect(page.getByText('Pytanie 1')).toBeVisible();

        for (let section = 1; section <= 7; section++) {
            const isLast = section === 7;
            await completeSection(page, isLast);
        }

        const toast = page.locator('text=Twój test został zapisany pomyślnie');
        await expect(toast).toBeVisible();
        await expect(page).toHaveURL(`/belbin/results/${employeeId}`);

        await expect(page.getByText('Wykres ról zespołowych')).toBeVisible();
        await expect(page.getByText('Szczegółowe wyniki')).toBeVisible();
        await expect(page.getByText('Twój dominujący styl to')).toBeVisible();
        await expect(page.getByText('Interpretacja wyników')).toBeVisible();
    });

    test('TC-BELBIN-DO-003: Obsługa błędu zapisu (symulacja błędu 500)', async ({ page }) => {
        await page.route('**/belbin/answers', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: "Symulowany błąd serwera" })
            });
        });

        await page.goto(`/belbin/test/${employeeId}`);
        await expect(page.getByText('Pytanie 1')).toBeVisible();

        for (let section = 1; section <= 7; section++) {
            const isLast = section === 7;
            await completeSection(page, isLast);
        }

        await expect(page.getByText('Symulowany błąd serwera')).toBeVisible();
        await expect(page).toHaveURL(`/belbin/test/${employeeId}`);
        const finishButton = page.getByRole('button', { name: 'Zakończ Test' });
        await expect(finishButton).toBeVisible();
        await expect(finishButton).toBeEnabled();
    });
});

test.describe('PU: Zrób Test Belbina (błąd)', () => {
    test('TC-BELBIN-DO-002: Obsługa błędu pobrania pytań (brak pytań)', async ({page}) => {
        await page.route('**/belbin/questions', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });

        const anyEmployeeId = 99999;
        await page.goto(`/belbin/test/${anyEmployeeId}`);

        const errorToast = page.locator('text=Brak dostępnych pytań');
        await expect(errorToast).toBeVisible();
        await expect(page.getByText('Pytanie 1')).not.toBeVisible();
    });
});