import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  
  constructor(private meta: Meta, private title: Title) {}
  
  ngOnInit() {
    this.updateMetaTags();
  }
  
  updateMetaTags() {
    this.title.setTitle('Privacy Policy - Swiftie Ranking Hub');
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Privacy Policy for Swiftie Ranking Hub. Learn how we collect, use, and protect your information.' 
    });
    this.meta.updateTag({ 
      name: 'robots', 
      content: 'index, follow' 
    });
  }
}