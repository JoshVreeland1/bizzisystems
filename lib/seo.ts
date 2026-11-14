export const site={name:"Bizzi Systems",appName:"Bizzi",productName:"Bizzi Lane Counter",domain:"https://bizzisystems.com",email:"josh@bizzisystems.com"};
export function absoluteUrl(path:string){return new URL(path,site.domain).toString();}
