import {
    Component,
    Input,
    OnInit
} from '@angular/core';

import {
    ButtonIconSizes,
    ButtonShapes,
    ButtonSizes,
    ButtonTypes
} from '../../../../shared/public-api';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
    @Input() buttonSize: ButtonSizes = ButtonSizes.medium;
    @Input() buttonShape: ButtonShapes = ButtonShapes.circle;
    @Input() buttonType: ButtonTypes;
    @Input() isActive = true;

    public size: string;
    public type: string;
    public fontSize: string;

    ngOnInit() {
        this.size = ButtonSizes[this.buttonSize];
        this.fontSize = ButtonIconSizes[this.buttonSize];
        this.type = ButtonTypes[this.buttonType];
    }

    public isCircle(): boolean {
        return this.buttonShape === ButtonShapes.circle;
    }

    public isRectangle(): boolean {
        return this.buttonShape === ButtonShapes.rectangle;
    }
}
