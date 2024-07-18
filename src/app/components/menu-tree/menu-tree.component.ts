import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-menu-tree',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, MatSidenavModule, MatNavList, MatListItem, RouterModule, MatSidenavContent
    , MatExpansionModule,],
  templateUrl: './menu-tree.component.html',
  styleUrl: './menu-tree.component.less',
})
export class MenuTreeComponent {
  @Input() menus: Menu[] = [];

}
