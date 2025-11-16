import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';

interface DashboardStats {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
  change?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, DashboardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  stats = signal<DashboardStats[]>([]);
  recentActivities = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      this.stats.set([
        {
          title: 'Total Users',
          value: '2,543',
          icon: '👥',
          bgColor: '#667eea',
          change: '+12.5%'
        },
        {
          title: 'Revenue',
          value: '$45,678',
          icon: '💰',
          bgColor: '#48bb78',
          change: '+8.2%'
        },
        {
          title: 'Active Projects',
          value: 24,
          icon: '📊',
          bgColor: '#ed8936',
          change: '+3'
        },
        {
          title: 'Pending Tasks',
          value: 12,
          icon: '✅',
          bgColor: '#38b2ac',
          change: '-5'
        }
      ]);

      this.recentActivities.set([
        { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
        { id: 2, action: 'Project "Website Redesign" completed', time: '1 hour ago', type: 'project' },
        { id: 3, action: 'Payment received from client', time: '3 hours ago', type: 'payment' },
        { id: 4, action: 'New task assigned to you', time: '5 hours ago', type: 'task' },
        { id: 5, action: 'Team meeting scheduled', time: '1 day ago', type: 'meeting' }
      ]);

      this.isLoading.set(false);
    }, 1000);
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      user: '👤',
      project: '📁',
      payment: '💳',
      task: '📝',
      meeting: '📅'
    };
    return icons[type] || '📌';
  }
}
