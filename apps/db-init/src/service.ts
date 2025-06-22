import { Injectable, OnModuleInit } from '@nestjs/common';
import { capitalize } from 'lodash';
import { DateTime as dt, Interval as int } from 'luxon';
import { Neo4jClient } from '@ns/neo4j'


@Injectable()
export class DBInitService  {
    constructor(private readonly client: Neo4jClient) {}

    async onModuleInit() {
        const isDatabaseNew = await this.determineIfDatabaseIsNew();
        if (isDatabaseNew) {
            await this.createIndexes();
            await this.createAppNodes(), await this.contract();
            await this.financialsources();
            await this.createBookingStages();
            await this.createDefaultProjectManager();
            await this.createStages();
            await this.createCalendarDays();

            console.log("Ran new db script");
        } else {
            console.log("db is not new.");
        }
    } //

    async determineIfDatabaseIsNew() {
        const queryResult = await this.client.read(
            `
            OPTIONAL MATCH (pm:DefaultProjectManager) 
            RETURN CASE 
                WHEN pm IS NOT NULL 
                    then false
                else true
            END AS isDatabaseNew`
        );
        return queryResult.records[0]?.get("isDatabaseNew");
    }

    async createIndexes() {
        const session = this.client.driver.session();
        //
        const constraints = [
            "CREATE CONSTRAINT constraints_app_name IF NOT EXISTS FOR (a0:App) REQUIRE a0.name IS UNIQUE",
            "CREATE CONSTRAINT constraint_uid IF NOT EXISTS FOR (w:User) REQUIRE (w.uid) IS UNIQUE",
            "CREATE CONSTRAINT constraints_accessgroup_name IF NOT EXISTS FOR (a:AccessGroup) REQUIRE (a.name) IS UNIQUE",
            "CREATE CONSTRAINT constraints_accessgroup_id IF NOT EXISTS FOR (a:AccessGroup) REQUIRE (a.id) IS UNIQUE",
            "CREATE CONSTRAINT constraints_accessgroup_name IF NOT EXISTS FOR (a:AccessGroup) REQUIRE (a.name) IS UNIQUE",
            "CREATE CONSTRAINT constraints_page_name IF NOT EXISTS FOR (p:Page) REQUIRE p.name IS UNIQUE",
            "CREATE CONSTRAINT constraints_workpackage_systematicName IF NOT EXISTS FOR (w:Workpackage) REQUIRE w.systematicName IS UNIQUE",
            "CREATE CONSTRAINT constraints_activity_id IF NOT EXISTS FOR (a0:Activity) REQUIRE a0.id IS UNIQUE",
            "CREATE CONSTRAINT constraints_resource_id IF NOT EXISTS FOR (r:Resource) REQUIRE r.id IS UNIQUE",
            "CREATE CONSTRAINT constraints_resourceType_id IF NOT EXISTS FOR (rt:ResourceType) REQUIRE rt.id IS UNIQUE",
            "CREATE CONSTRAINT constraints_agent IF NOT EXISTS FOR (ag:Agent) REQUIRE ag.id IS UNIQUE",
            "CREATE CONSTRAINT constraints_stage IF NOT EXISTS FOR (s:Stage) REQUIRE s.name IS UNIQUE",
            "CREATE CONSTRAINT constraints_bookingstage IF NOT EXISTS FOR (b:BookingStage) REQUIRE b.name IS UNIQUE",
            "CREATE CONSTRAINT constraints_contract IF NOT EXISTS FOR (c:Contract) REQUIRE (c.id, c.name, c.abbrevation) IS UNIQUE",
            "CREATE CONSTRAINT constraints_financialsource IF NOT EXISTS FOR (f:FinancialSource) REQUIRE (f.id, f.name) IS UNIQUE",
            "CREATE RANGE INDEX calendarday_weekYear_index IF NOT EXISTS FOR (c1:CalendarDay) ON (c1.week, c1.year)",
            "CREATE RANGE INDEX calendarday_date_index IF NOT EXISTS FOR (c2:CalendarDay) ON c2.date",
            "CREATE RANGE INDEX activity_interval IF NOT EXISTS FOR (a2:Activity) ON (a2.startDate, a2.endDate)",
            "CREATE RANGE INDEX activity_startDate IF NOT EXISTS FOR (a3:Activity) ON a3.startDate",
            "CREATE RANGE INDEX activity_endDate IF NOT EXISTS FOR (a3:Activity) ON a3.endDate",
            "CREATE RANGE INDEX permission_read IF NOT EXISTS FOR ()-[p:HAS_PERMISSIONS]-() ON p.read",
            "CREATE RANGE INDEX permission_write IF NOT EXISTS FOR ()-[p:HAS_PERMISSIONS]-() ON p.write",
            "CREATE RANGE INDEX permission_delete IF NOT EXISTS FOR ()-[p:HAS_PERMISSIONS]-() ON p.delete",
        ];

        for (let i = 0; i < constraints.length; i++) {
            await session.run(constraints[i]);
        }

        await session.close();
    }

    async createDefaultProjectManager() {
        await this.client.write(`
    MERGE (:ProjectManager:DefaultProjectManager {
        color: "CECECE",
        id: "95fde6bc-fef3-488c-811f-044a9c135782",
        name: "Ingen"
    })
`);
    }

    mapDays(startDate: string, endDate: string) {
        const interval = int.fromDateTimes(
            dt.fromISO(startDate).setZone("utc").setLocale("da"),
            dt.fromISO(endDate).setZone("utc").setLocale("da")
        );
        return interval.splitBy({ days: 1 }).map((date) => {
            let labels: string[] = ["CalendarDay"];
            if ([6, 7].includes(date.start.weekday)) {
                labels.push("Weekend");
            } else {
                labels.push("BusinessDay");
            }
            const properties = {
                date: date.start.toFormat("yyyy-MM-dd"),
                week: date.start.weekNumber,
                weekdayName: capitalize(date.start.toFormat("cccc")),
                weekday: date.start.weekday,
                year: date.start.year,
            };
            return {
                labels: labels,
                properties: properties,
            };
        });
    }

    async createCalendarDays() {
        const days = this.mapDays(
            dt.now().minus({ years: 2 }).toFormat("yyyy-MM-dd"),
            dt.now().plus({ years: 5 }).toFormat("yyyy-MM-dd")
        );
        await this.client.write(
            `
        MERGE (c:Calendar {
            isDefault: true
        })
        SET c += {
            name: "Standardkalender",
            id: apoc.create.uuid()
        }   
        WITH c
        CALL {
            WITH c
            MATCH (r:Resource)
            UNWIND r AS R
            MERGE (R)-[:USES]->(c)
        }     
        UNWIND $days as day
        CALL apoc.merge.node(day.labels, {
            date: day.properties.date
        })
        YIELD node
    
        CALL {
            WITH node, day
            SET node += {
                week: toInteger(day.properties.week),
                weekdayName: day.properties.weekdayName,
                weekday: toInteger(day.properties.weekday),
                year: toInteger(day.properties.year)
            }
        }
        
`,
            { days: days }
        );

        await this.client.write(
            `
            MATCH (c:Calendar {isDefault: true})
            MATCH (d:BusinessDay)
            UNWIND d as day
                MERGE (c)-[:HAS_WORKDAY {capacity: $capacity}]->(day)
        
        `,
            { capacity: 480 }
        );
    }

    async createStages() {
        await this.client.write(`
    MERGE (:Stage {
        color: "#636ECF",
        name: "Ny",
        sequence: 0
    })
    MERGE (:Stage {
        color: "#3541AC",
        name: "Tilbud",
        sequence: 1
    })
    MERGE (:Stage {
        color: "#AF74E7",
        name: "Implementering",
        sequence: 2
    })
    MERGE (:Stage {
        color: "#3C8299",
        name: "Gennemført",
        sequence: 3
    })
    MERGE (:Stage {
        color: "#E8C387",
        name: "På hold",
        sequence: 4
    })
    MERGE (:Stage {
        color: "#DE3F4A",
        name: "Annulleret",
        sequence: 5
    })
`);
    }

    async createBookingStages() {
        await this.client.write(`
    MERGE (:BookingStage {
        color: "#A8C5DA",
        name: "Ingen",
        sequence: 0
    })
    MERGE (:BookingStage {
        color: "#95A4FC",
        name: "Hard",
        sequence: 2
    })
    MERGE (:BookingStage {
        color: "#AF74E7",
        name: "Soft",
        sequence: 1
    })
`);
    }

    async contract() {
        await this.client.write(`
            MERGE (c:Contract {name: "Rådgiverkontrakt", abbrevation: "Rådg"})
            ON CREATE
                SET c.id = apoc.create.uuid()
        `);
    }

    async financialsources() {
        await this.client.write(`
            WITH ["BDK", "CP", "NFTE", "JTL"] as ss
            UNWIND ss AS s
                MERGE (f:FinancialSource {name: s})
                    ON CREATE 
                        SET f.id = apoc.create.uuid()
        `);
    }

    async createAppNodes() {
        await this.client.write(`

        CALL {
            CREATE (adminGroup:AccessGroup {
                id: apoc.create.uuid(),
                name: "Admin",
                isAdmin: true,
                color: "#89B6A5"
            })
            RETURN adminGroup
        }

            CALL {
                WITH adminGroup
                CREATE (u:User {
                    name: "Mathias Øhrgaard",
                    email: "mathioee@gmail.com",
                    lastSeen: null,
                    isOnline: false,
                    isDeactivated: false,
                    color: "#0B5351",
                    id: "user1",
                    uid: "user1"
                })
                CREATE (c:Credentials {
                    changedAt: timestamp(),
                    password: "Ninus2009",
                    username: "mathioee@gmail.com"
                })
                MERGE (u)-[:HAS_CREDENTIALS]->(c)
                MERGE (u)-[:IN_ACCESS_GROUP {timestamp: timestamp()}]->(adminGroup)
            }


            CALL {
                CREATE (workpackagePage:Page {
                    name: "Arbejdspakker",
                    url: "workpackages",
                    sequence: 0
                })

                CREATE (capacityPage:Page {
                    name: "Kapacitet",
                    url: "capacity",
                    sequence: 1
                })

                CREATE (resourcesPage:Page {
                    name: "Ressourcer",
                    url: "resources",
                    sequence: 2
                })

                CREATE (projectManagersPage:Page {
                    name: "Projektledere",
                    url: "project-manager",
                    sequence: 3
                })

                CREATE (resourcetypesPage:Page {
                    name: "Ressourcetyper",
                    url: "resourcetypes",
                    sequence: 4
                })

                CREATE (contractsPage:Page {
                    name: "Kontrakter",
                    url: "contracts",
                    sequence: 5
                })

                CREATE (financialsourcesPage:Page {
                    name: "Finanskilder",
                    url: "financialsources",
                    sequence: 6
                })

                CREATE (usersPage:Page {
                    name: "Brugere",
                    url: "administration/users",
                    sequence: 7
                })

                CREATE (authPage:Page {
                    name: "Adgangsgrupper",
                    url: "administration/access-groups",
                    sequence: 8
                })

                RETURN workpackagePage, capacityPage, resourcesPage, resourcetypesPage, contractsPage, financialsourcesPage, authPage, usersPage, projectManagersPage
            }

            CALL {
                WITH adminGroup, workpackagePage, capacityPage, resourcesPage, resourcetypesPage, contractsPage, financialsourcesPage, authPage, usersPage, projectManagersPage

                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(workpackagePage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(capacityPage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(resourcesPage)

                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(projectManagersPage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(resourcetypesPage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(contractsPage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(financialsourcesPage)
    
                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(authPage)

                MERGE (adminGroup)-[:HAS_PERMISSIONS {
                    read: true,
                    write: true,
                    delete: true
                }]->(usersPage)
            }

        `);
    }
}
