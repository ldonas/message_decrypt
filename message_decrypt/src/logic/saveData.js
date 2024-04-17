export function SaveData(name, value){
    window.localStorage.setItem(name, JSON.stringify(value));
}

export function LoadData(name){
    const data = window.localStorage.getItem(name);
    return JSON.parse(data) || false;
}