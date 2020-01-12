export interface ToDoModel {
    id?: string;
    userId: string | null;
    name: string;
    price: number | null;
    ok: boolean | null;
    checkedDate: Date | null;
}

export interface ToDoListModel {
    checklist: ToDoModel[];
}
