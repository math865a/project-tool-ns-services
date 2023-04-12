export function getWelcomeHTML(
    name: string,
    username: string,
    password: string
) {
    return `
    <div>
        <p>Hej ${name.split(" ")[0]}</p>,
        <p>
            BLABLABLA
        </p>
        <p>
            Du har fået oprettet en bruger til <a href="http://project-tool.dk">Project Tool</a>. 
        </p>
        <p>
            Dine adgangsoplysninger er nedenfor.
        </p>
        <p> 
            <strong>Brugernavn: </strong>${username}
        </p>
        <p> 
            <strong>Password: </strong> ${password}
        </p>
        <br/>
        <p> 
            Du kan ændre dit password når du er logget ind.
        </p>
    </div>
    `;
}
