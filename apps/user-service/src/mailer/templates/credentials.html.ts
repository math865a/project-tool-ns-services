export function getCredentialsHTML(
    name: string,
    username: string,
    password: string
) {
    return `
        <div>
        <p>
            Hej ${name.split(" ")[0]},
        </p>
        <p> 
            Nedenstående finder du dine adgangsoplysninger til 
            <a href="https://project-tool.dk/login">
                Project Tool
            </a>.
        </p>
        
        <p> 
            <strong>
                Brugernavn: 
            </strong>
            ${username}
        <br style="line-height: 10px"/>
            <strong>
                Password: 
            </strong> 
            ${password}
        </p>
        <p> 
            Med venlig hilsen 
        <br style="line-height: 10px"/>
            Project Tool
        </p>
    </div>
    `;
}
