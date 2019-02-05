import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

export enum ButtonSizes {
    small = '15',
    medium = '30',
    big = '40',
}

export enum ButtonIconSizes {
    small = '10',
    medium = '14',
    big = '22',
}

export enum ButtonTypes {
    left = 'angle-left',
    right = 'angle-right',
    plus = 'plus',
    minus = 'minus',
    home = 'home',
}

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    @Input() buttonSize: ButtonSizes = ButtonSizes.medium;
    @Input() buttonType: ButtonTypes = ButtonTypes.plus;

    public size: string;
    public type: string;
    public fontSize: string;

    constructor() { }

    ngOnInit() {
        this.size = ButtonSizes[this.buttonSize] + 'px';
        this.type = ButtonTypes[this.buttonType];
        this.fontSize = ButtonIconSizes[this.buttonSize] + 'px';
    }
}
