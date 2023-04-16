export function getWelcomeHTML(
    name: string,
    username: string,
    password: string
) {
    return `
    <div>
        <p>Hej ${name.split(" ")[0]},</p>

        <p>Vi har glædet os meget, til at byde dig velkommen på Project Tool.</p>

        <p> Nedenstående finder du dine adgangsoplysninger:</p>
        <p> <strong>Mailadresse: </strong>${username}</p>
        <p> <strong>Adgangskode: </strong>${password}</p>
        <p>Du kan logge ind via http://project-tool.dk</p>
        <br/>
        <p>
            Med denne adgang kan du bruge systemet til at holde dig opdateret omkring dine opgaver.
            Dit overblik er dog kun så godt, som datakvaliteten tillader; vi håber du vil hjælpe med til ved at tage fat i den pågældende projektleder når du oplever uoverensstemmelser,
            eller har indvendinger til projektrelaterede sager.
        </p>
        <p>
            Dette er første version er dit overblik, og der er meget plads til forbedring, optimering og nye funktioner. Vi vil
            vildt gerne have dig med som en aktiv del af udviklingsprocessen. For at give indflydelse heri, kan du bruge systemet til at rapportere fejl, ønsker til nye funktioner og andet. 
            Med denne feedback kan du være med til at forme systemet til dine behov.
        </p>
        <p>Hvis du oplever akutte tekniske problemer, så hiv fat i mig direkte på denne mail, eller på tlf. 28294450.
        </p>
        <br/>
        <p> Vi håber du får glæde at dit nye værktøj!</p>
        <p>Med venlig hilsen Mathias Øhrgaard</p>
    </div>`;
}
