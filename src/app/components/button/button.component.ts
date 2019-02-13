import {
    Component,
    HostBinding,
    Input,
    OnInit,
} from '@angular/core';

enum ButtonSizes {
    small = '15',
    medium = '30',
    big = '40',
}

enum ButtonIconSizes {
    small = '10',
    medium = '14',
    big = '22',
}

enum ButtonTypes {
    left = 'angle-left',
    right = 'angle-right',
    plus = 'plus',
    minus = 'minus',
    home = 'home',
}

export enum ButtonShapes {
    circle = 'circle',
    rectangle = 'rectangle',
}

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    @Input() buttonSize: ButtonSizes = ButtonSizes.medium;
    @Input() buttonShape: ButtonShapes = ButtonShapes.circle;
    @Input() buttonType: ButtonTypes;

    // @HostBinding('class.app-button-circle') public isCircle: boolean;
    // @HostBinding('class.app-button-rectangle') public isRectangle: boolean;

    public size: string;
    public type: string;
    public fontSize: string;

    constructor() { }

    ngOnInit() {
        this.size = ButtonSizes[this.buttonSize] + 'px';
        this.fontSize = ButtonIconSizes[this.buttonSize] + 'px';
        this.type = ButtonTypes[this.buttonType];
        // this.isCircle = this.buttonShape === ButtonShapes.circle;
        // this.isRectangle = this.buttonShape === ButtonShapes.rectangle;
    }

    public isCircle(): boolean {
        return this.buttonShape === ButtonShapes.circle;
    }

    public isRectangle(): boolean {
        return this.buttonShape === ButtonShapes.rectangle;
    }
}
