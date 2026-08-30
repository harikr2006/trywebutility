const firstNames = ["Alice","Bob","Charlie","Diana","Edward","Fiona","George","Hannah","Ivan","Julia","Kevin","Laura","Michael","Nina","Oscar","Patricia","Quentin","Rachel","Samuel","Tina","Uma","Victor","Wendy","Xavier","Yara","Zack"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Young","Lewis","Walker"];
const domains = ["gmail.com","yahoo.com","outlook.com","protonmail.com","icloud.com","example.com"];
const streets = ["Main St","Oak Ave","Maple Dr","Cedar Ln","Elm St","Pine Rd","Sunset Blvd","River Rd","Park Ave","Lake Dr"];
const cities = ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","San Jose"];
const states = ["CA","NY","TX","FL","IL","PA","OH","GA","NC","MI"];
const companies = ["Acme Corp","Globex","Initech","Umbrella Corp","Stark Industries","Wayne Enterprises","Hooli","Pied Piper","Dunder Mifflin","Vandelay Industries"];
const jobTitles = ["Software Engineer","Product Manager","Designer","Data Analyst","DevOps Engineer","Marketing Lead","Sales Rep","CEO","CTO","QA Engineer"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

export interface FakeRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  company: string;
  jobTitle: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function generateFakeData(count: number): FakeRecord[] {
  return Array.from({ length: Math.min(count, 200) }, (_, i) => {
    const first = pick(firstNames);
    const last = pick(lastNames);
    return {
      id: String(i + 1).padStart(4, "0"),
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${rand(1,99)}@${pick(domains)}`,
      phone: `+1-${rand(200,999)}-${rand(100,999)}-${rand(1000,9999)}`,
      age: rand(18, 65),
      company: pick(companies),
      jobTitle: pick(jobTitles),
      address: `${rand(1, 9999)} ${pick(streets)}`,
      city: pick(cities),
      state: pick(states),
      zipCode: String(rand(10000, 99999)),
      country: "US",
    };
  });
}
