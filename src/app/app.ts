// Component 根元件
import { Component } from '@angular/core';
// Router 元件導入
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // RouterOutlet 會動態載入對應的 Component
  // RouterLink 用於在模板中建立路由連結
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {}