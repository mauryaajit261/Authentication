import { Component } from '@angular/core';

@Component({
  selector: 'app-system-logs',
  standalone: false,
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.css']
})
export class SystemLogsComponent {
  logs: string[] = [];

  fetchLogs() {
    this.logs = [
      'User admin logged in',
      'Organization ABC added',
      'Super Admin assigned Admin to XYZ'
    ];
  }
}
