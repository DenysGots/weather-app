import {
    Component,
    Input,
    OnInit,
} from '@angular/core';

export enum IconSizes {
    small = '12',
    medium = '14',
    extra = '18',
    big = '22',
    hero = '28',
    extra_big = '36',
}

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
