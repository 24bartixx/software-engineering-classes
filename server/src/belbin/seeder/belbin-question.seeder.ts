import {Injectable, OnModuleInit } from "@nestjs/common";
import {BelbinQuestion} from "../entities/belbin-question.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BelbinRolesMetadata } from "../entities/belbin-roles-metadata.entity";

@Injectable()
export class BelbinQuestionSeeder implements OnModuleInit {
    constructor(
        @InjectRepository(BelbinQuestion) private questionRepo: Repository<BelbinQuestion>,
        @InjectRepository(BelbinRolesMetadata) private belbinRolesMetadataRepo: Repository<BelbinRolesMetadata>
    ) {}

    async onModuleInit() {
        await this.seedQuestions();
        await this.seedMetadata();
    }

    async seedQuestions() {
        if (await this.questionRepo.count() > 0) return;
        await this.questionRepo.save(BELBIN_QUESTIONS);
        console.log('Pytania Belbina załadowane do bazy');
    }

    async seedMetadata() {
        if (await this.belbinRolesMetadataRepo.count() > 0) return;
        await this.belbinRolesMetadataRepo.save(BELBIN_ROLES_METADATA);
        console.log('Metadane ról Belbina załadowane do bazy');
    }
}

const BELBIN_QUESTIONS = [
    {
        content: "Co jest moim wkładem w pracę zespołu?",
        statements: [
            {
                id: "1a",
                text: "Potrafię szybko dostrzegać i wykorzystywać nowe możliwości",
                relatedRole: "Resource Investigator"
            },
            {
                id: "1b",
                text: "Dobrze współpracuję z różnymi ludźmi",
                relatedRole: "Teamworker"
            },
            {
                id: "1c",
                text: "Generowanie pomysłów jest moją naturalną umiejętnością",
                relatedRole: "Plant"
            },
            {
                id: "1d",
                text: "Umiem sprawić, aby ludzie pracowali nad konkretnymi zadaniami",
                relatedRole: "Coordinator"
            },
            {
                id: "1e",
                text: "Mam zdolność do doprowadzania spraw do końca",
                relatedRole: "Completer Finisher"
            },
            {
                id: "1f",
                text: "Jestem gotów być niepopularnym, jeśli prowadzi to do sensownych rezultatów",
                relatedRole: "Shaper"
            },
            {
                id: "1g",
                text: "Potrafię przedstawić, co mam do zaoferowania w danej sytuacji",
                relatedRole: "Specialist"
            },
            {
                id: "1h",
                text: "Umiem rozpoznawać możliwości mojego zespołu i je wykorzystywać",
                relatedRole: "Coordinator"
            }
        ]
    },
    {
        content: "Jeśli mam słabe strony w pracy zespołowej, to może to być tak, że:",
        statements: [
            {
                id: "2a",
                text: "Czuję się nieswojo, dopóki spotkania nie są dobrze zorganizowane i kontrolowane",
                relatedRole: "Implementer"
            },
            {
                id: "2b",
                text: "Mam skłonność do okazywania wielkoduszności wobec innych",
                relatedRole: "Teamworker"
            },
            {
                id: "2c",
                text: "Mam tendencję do zbyt dużego mówienia",
                relatedRole: "Resource Investigator"
            },
            {
                id: "2d",
                text: "Mój obiektywny pogląd utrudnia mi dołączenie do kolegów",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "2e",
                text: "Czasami jestem postrzegany jako osoba wywierająca presję",
                relatedRole: "Shaper"
            },
            {
                id: "2f",
                text: "Trudno mi stawić czoła trudnym sytuacjom",
                relatedRole: "Teamworker"
            },
            {
                id: "2g",
                text: "Mam tendencję do popadania w marzenia, gdy tracę zainteresowanie",
                relatedRole: "Plant"
            },
            {
                id: "2h",
                text: "Znajduję trudności w rozpoczynaniu, gdy nie są jasne cele",
                relatedRole: "Specialist"
            }
        ]
    },
    {
        content: "Kiedy jestem zaangażowany w projekt z innymi ludźmi:",
        statements: [
            {
                id: "3a",
                text: "Potrafię wpływać na ludzi bez wywierania na nich presji",
                relatedRole: "Coordinator"
            },
            {
                id: "3b",
                text: "Moja czujność zapobiega błędom i zaniedbaniom",
                relatedRole: "Completer Finisher"
            },
            {
                id: "3c",
                text: "Jestem gotów naciskać na działanie, aby upewnić się, że spotkanie nie jest stratą czasu",
                relatedRole: "Shaper"
            },
            {
                id: "3d",
                text: "Można na mnie liczyć, że wniosę coś oryginalnego",
                relatedRole: "Plant"
            },
            {
                id: "3e",
                text: "Jestem zawsze gotów poprzeć dobrą propozycję",
                relatedRole: "Teamworker"
            },
            {
                id: "3f",
                text: "Szybko znajduję to, co jest możliwe do osiągnięcia",
                relatedRole: "Resource Investigator"
            },
            {
                id: "3g",
                text: "Wierzę, że moja zdolność do osądzania może pomóc w podjęciu właściwych decyzji",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "3h",
                text: "Można na mnie polegać, że dopilnuję szczegółów",
                relatedRole: "Implementer"
            }
        ]
    },
    {
        content: "Moje charakterystyczne podejście do pracy grupowej polega na tym, że:",
        statements: [
            {
                id: "4a",
                text: "Mam szczególne zainteresowanie poznawaniem moich kolegów",
                relatedRole: "Teamworker"
            },
            {
                id: "4b",
                text: "Nie waham się kwestionować poglądów innych lub stanowić mniejszości",
                relatedRole: "Shaper"
            },
            {
                id: "4c",
                text: "Zazwyczaj potrafię znaleźć argumenty przeciwko nieprawidłowym propozycjom",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "4d",
                text: "Myślę, że mam talent do tego, aby sprawy działały, gdy plan musi być zrealizowany",
                relatedRole: "Implementer"
            },
            {
                id: "4e",
                text: "Mam tendencję do unikania oczywistego i wychodzenia z czymś nieoczekiwanym",
                relatedRole: "Plant"
            },
            {
                id: "4f",
                text: "Dobieram perfekcyjnie wszystko, co robię",
                relatedRole: "Completer Finisher"
            },
            {
                id: "4g",
                text: "Umiem wykorzystać kontakty zewnętrzne",
                relatedRole: "Resource Investigator"
            },
            {
                id: "4h",
                text: "Interesują mnie wszystkie poglądy, ale nie mam problemu z podjęciem decyzji",
                relatedRole: "Coordinator"
            }
        ]
    },
    {
        content: "Czerpię satysfakcję z pracy, ponieważ:",
        statements: [
            {
                id: "5a",
                text: "Lubię analizować sytuacje i rozważać wszystkie możliwe opcje",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "5b",
                text: "Interesuję się znajdowaniem praktycznych rozwiązań problemów",
                relatedRole: "Implementer"
            },
            {
                id: "5c",
                text: "Lubię czuć, że sprzyjam dobrym relacjom roboczym",
                relatedRole: "Teamworker"
            },
            {
                id: "5d",
                text: "Potrafię mieć silny wpływ na decyzje",
                relatedRole: "Shaper"
            },
            {
                id: "5e",
                text: "Mogę poznać ludzi, którzy mogą zaoferować coś nowego",
                relatedRole: "Resource Investigator"
            },
            {
                id: "5f",
                text: "Mogę sprawić, że ludzie zgodzą się co do kierunku działania",
                relatedRole: "Coordinator"
            },
            {
                id: "5g",
                text: "Czuję się w swoim żywiole, gdy mogę skupić całą uwagę na zadaniu",
                relatedRole: "Specialist"
            },
            {
                id: "5h",
                text: "Lubię znajdować obszar, który pobudza moją wyobraźnię",
                relatedRole: "Plant"
            }
        ]
    },
    {
        content: "Jeśli nagle otrzymam trudne zadanie z ograniczonym czasem i nieznajomymi ludźmi:",
        statements: [
            {
                id: "6a",
                text: "Czułbym się jak wycofanie się w róg, aby opracować sposób wyjścia z impasu",
                relatedRole: "Plant"
            },
            {
                id: "6b",
                text: "Byłbym gotów pracować z osobą, która wykazuje najbardziej pozytywne podejście",
                relatedRole: "Teamworker"
            },
            {
                id: "6c",
                text: "Znalazłbym sposób na zmniejszenie rozmiaru zadania poprzez ustalenie, co różni ludzie mogą najlepiej wnieść",
                relatedRole: "Coordinator"
            },
            {
                id: "6d",
                text: "Moje naturalne poczucie pilności pomogłoby nam dotrzymać harmonogramu",
                relatedRole: "Completer Finisher"
            },
            {
                id: "6e",
                text: "Wierzę, że zachowałbym spokój i zdolność do logicznego myślenia",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "6f",
                text: "Utrzymałbym stały cel pomimo presji",
                relatedRole: "Implementer"
            },
            {
                id: "6g",
                text: "Byłbym gotów przejąć prowadzenie, gdyby grupa nie posuwała się naprzód",
                relatedRole: "Shaper"
            },
            {
                id: "6h",
                text: "Otworzyłbym dyskusje mające na celu stymulowanie nowych myśli i popchnięcie czegoś",
                relatedRole: "Resource Investigator"
            }
        ]
    },
    {
        content: "W odniesieniu do problemów, z którymi pracuję w grupach:",
        statements: [
            {
                id: "7a",
                text: "Mam skłonność do okazywania niecierpliwości wobec tych, którzy utrudniają postęp",
                relatedRole: "Shaper"
            },
            {
                id: "7b",
                text: "Inni mogą mnie krytykować za to, że jestem zbyt analityczny",
                relatedRole: "Monitor Evaluator"
            },
            {
                id: "7c",
                text: "Moje pragnienie, aby wszystko było dobrze zrobione, może czasami powodować opóźnienia",
                relatedRole: "Completer Finisher"
            },
            {
                id: "7d",
                text: "Mam tendencję do szybkiego znudzenia się i polegam na jednym lub dwóch stymulujących członkach, aby wzbudzić moje zainteresowanie",
                relatedRole: "Plant"
            },
            {
                id: "7e",
                text: "Trudno mi zacząć, jeśli cele nie są jasne",
                relatedRole: "Implementer"
            },
            {
                id: "7f",
                text: "Czasami mam trudności z wyjaśnieniem i objaśnieniem złożonych kwestii",
                relatedRole: "Specialist"
            },
            {
                id: "7g",
                text: "Jestem świadomy wymagania od innych czegoś, czego sam nie jestem w stanie zrobić",
                relatedRole: "Coordinator"
            },
            {
                id: "7h",
                text: "Waham się przedstawić mój punkt widzenia w obecności silnej opozycji",
                relatedRole: "Teamworker"
            }
        ]
    }
];

const BELBIN_ROLES_METADATA = [
    {
        property: 'plantScore',
        id: 'plant',
        name: 'Kreator (Plant)',
        description: 'Kreatywny, pomysłowy, obdarzony wyobraźnią, nieszablonowy. Rozwiązuje trudne problemy w nietypowy sposób.'
    },
    {
        property: 'resourceInvestigatorScore',
        id: 'resource_investigator',
        name: 'Poszukiwacz Źródeł (Resource Investigator)',
        description: 'Entuzjastyczny, komunikatywny. Bada możliwości i rozwija kontakty.'
    },
    {
        property: 'coordinatorScore',
        id: 'coordinator',
        name: 'Koordynator (Coordinator)',
        description: 'Dojrzały, pewny siebie. Wyjaśnia cele, promuje decyzyjność i dobrze deleguje zadania.'
    },
    {
        property: 'shaperScore',
        id: 'shaper',
        name: 'Inspirator (Shaper)',
        description: 'Dynamiczny, otwarty, radzi sobie z presją. Ma odwagę i siłę, by pokonywać przeszkody.'
    },
    {
        property: 'monitorEvaluatorScore',
        id: 'monitor_evaluator',
        name: 'Ewaluator (Monitor Evaluator)',
        description: 'Strategiczny i wnikliwy. Widzi wszystkie opcje i trafnie ocenia sytuację. Rzadko się myli.'
    },
    {
        property: 'teamWorkerScore',
        id: 'teamworker',
        name: 'Dusza Zespołu (Teamworker)',
        description: 'Kooperatywny, dyplomatyczny, spostrzegawczy. Słucha innych i łagodzi konflikty. Buduje harmonię w grupie.'
    },
    {
        property: 'implementerScore',
        id: 'implementer',
        name: 'Realizator (Implementer)',
        description: 'Praktyczny, niezawodny, zorganizowany, zdyscyplinowany. Przekształca pomysły w konkretne działania.'
    },
    {
        property: 'completerFinisherScore',
        id: 'completer_finisher',
        name: 'Perfekcjonista (Completer Finisher)',
        description: 'Sumienny, dbający o szczegóły. Sprawdza pracę pod kątem błędów i pilnuje, aby wszystko było wykonane na czas.'
    },
    {
        property: 'specialistScore',
        id: 'specialist',
        name: 'Specjalista (Specialist)',
        description: 'Jednostka skupiona na celu. Dostarcza rzadkiej wiedzy i umiejętności.'
    }
];