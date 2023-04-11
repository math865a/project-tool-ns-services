export function getCredentialsHTML(
    name: string,
    username: string,
    password: string
) {
    return `
        <div>
        <p>
            Hej ${name.split(" ")[0]}},
        </p>
        <br/>
        <p> 
            Nedenstående finder du dine adgangsoplysninger til 
            <a href="http://100.64.100.70:3001/login">
                Project Tool
            </a>
            .
        </p>
        
        <p> 
            <strong>
                Brugernavn: 
            </strong>
            ${username}
        </p>
        <p> 
            <strong>
                Password: 
            </strong> 
            ${password}
        </p>

        <br/>
        <p> 
            Med venlig hilsen 
        </p>
        <p> 
            Project Tool 
        </p>
    </div>
    `;
}
