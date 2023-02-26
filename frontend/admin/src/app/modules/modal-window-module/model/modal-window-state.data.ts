export interface ModalWindowStateData {
    translate?: { tx: number, ty: number };
    size?: { width: string, height: string };
    sizeModifiers: {
        fullSize: boolean;
        defaultSize: boolean;
        minimize: boolean;
    };
}
