export class SessionUtil {

    static putObjectInSession(label, data){
        localStorage.setItem(label, JSON.stringify(data));
    }

    static getObjectFromSession(label){
        let item = localStorage.getItem(label);
        if(item != null)
            return JSON.parse(item)
        else 
            return null;
    }

}
