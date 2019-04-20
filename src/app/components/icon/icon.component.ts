import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import { IconSizes } from '../../../../shared/public-api';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit, OnChanges {
    @Input() iconType: string;
    @Input() iconSize: IconSizes = IconSizes.medium;

    public iconUrl: string;
    public size: number;

    constructor() { }

    ngOnInit() {
        this.setIconUrl();
        this.setIconSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('iconType' in changes && !changes.iconType.firstChange) {
            this.setIconUrl();
        }
    }

    public setIconUrl() {
        this.iconUrl = `url(../../assets/img/weather_icons/animated/${this.iconType}.svg)`;
    }

    public setIconSize() {
        this.size = IconSizes[this.iconSize];
    }
}
