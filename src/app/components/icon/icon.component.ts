import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

import { IconSizes } from '../../interfaces/public-api';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
    @Input() iconType: string;
    @Input() iconSize: IconSizes = IconSizes.medium;

    public iconUrl: string;
    public size: string;

    constructor() { }

    ngOnInit() {
        this.iconUrl = `url(../../assets/img/weather_icons/animated/${this.iconType}.svg)`;
        this.size = 2 * IconSizes[this.iconSize] + 'px';
    }
}
