type Callback = (item:any) => void;

class Using {

    constructor(private data:Array<any>) {
    }

    public describe(description:string, callback:Callback):Using {
        describe(description, () => {
            this.data.forEach((item:any) => {
                callback(item);
            });
        });
        return this;
    }

}

function using(data:Array<any>):Using {
    return new Using(data);
}

export {using};
