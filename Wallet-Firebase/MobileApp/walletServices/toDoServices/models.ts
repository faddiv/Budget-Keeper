export interface ToDoModel {
    id?: string;
    userId: string;
    name: string;
    price: number;
    ok?: boolean;
    checkedDate?: Date;
}

export interface ToDoListModel {
    checklist: ToDoModel[];
}
