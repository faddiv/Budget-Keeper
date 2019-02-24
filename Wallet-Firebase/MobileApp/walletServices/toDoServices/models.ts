export interface ToDoModel {
    id?: string;
    userId: string;
    name: string;
    price: number;
    ok?: boolean;
}

export interface ToDoListModel {
    checklist: ToDoModel[];
}
