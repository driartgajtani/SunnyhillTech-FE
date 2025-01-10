import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ProfileComponent } from './profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { JwtService } from '../../services/jwt.service';
import { JwtToken } from '../../models/auth/jwt-token';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService to show error messages

@Component({
  selector: 'app-home',
  imports: [RouterModule, MatSidenavModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  /**
   *
   */
  data: JwtToken;
  currentTime: string;
  greetingMessage: string;

  constructor(private router: Router, private dialog: MatDialog, private jwtService: JwtService, private toastr: ToastrService, private profileService: ProfileService) {
    this.data = this.jwtService.decodeToken();
    this.profileService.loadProfile(+this.data.Id)
    this.currentTime = this.getCurrentTime(); // Get the current time
    this.greetingMessage = this.getGreetingMessage(this.currentTime, this.data.roles.toString());
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileComponent, {
      data: this.profileService.profile$,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.profileService.loadProfile(+this.data.Id)
        this.greetingMessage = this.getGreetingMessage(this.currentTime, this.data.roles.toString());
        this.toastr.success('Updated Successfully')
        // Handle profile update success
      } else if (result === 'error') {
        console.log('Error updating profile');
        // Handle profile update failure
      }
    });
  }

  private getCurrentTime(): string {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'morning';
    } else if (currentHour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  }

  private getGreetingMessage(timeOfDay: string, role: string): string {
    let greeting: string;

    // Adjust greeting based on time of day
    switch (timeOfDay) {
      case 'morning':
        greeting = 'Good Morning';
        break;
      case 'afternoon':
        greeting = 'Good Afternoon';
        break;
      case 'evening':
        greeting = 'Good Evening';
        break;
    }

    // Append role-based message
    switch (role.toLowerCase()) {
      case 'admin':
        greeting += ', Admin! ' + this.data.Name;
        break;
      default:
        greeting += ', ' +this.data.Name;
        break;
    }

    return greeting;
  }

  logout() {
    this.jwtService.purgeAuth();
    this.router.navigate(['/login']);
  }
}
