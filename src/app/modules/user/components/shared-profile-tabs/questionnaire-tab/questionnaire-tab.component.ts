import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserProfile } from '../../../../../interfaces/userProfile';

@Component({
  selector: 'app-questionnaire-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questionnaire-tab.component.html',
  styleUrls: ['./questionnaire-tab.component.scss'],
})
export class QuestionnaireTabComponent {
  @Input() userProfile!: UserProfile;
  @Input() isEditable: boolean = false;
  @Input() isOwner: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() theme: string = 'Fearless'; // Default theme
  @Output() editingChange = new EventEmitter<boolean>();
  @Output() questionUpdated = new EventEmitter<{
    index: number;
    answer: string;
  }>();
  @Output() saveAnswers = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  getThemeClass(): string {
    const themeClassMap: { [key: string]: string } = {
      Debut: 'Debut',
      Fearless: 'Fearless',
      'Speak Now': 'SpeakNow',
      Red: 'Red',
      '1989': '_1989',
      Reputation: 'Reputation',
      Lover: 'Lover',
      Folklore: 'Folklore',
      Evermore: 'Evermore',
      Midnights: 'Midnights',
      'The Tortured Poets Department': 'TorturedPoets',
      'The Life of a Showgirl': 'LifeOfAShowgirl'
    };
    const currentTheme = this.theme || this.userProfile?.theme || 'Fearless';
    return themeClassMap[this.theme] || 'Fearless';
  }

  startEditing() {
    this.isEditing = true;
    this.editingChange.emit(this.isEditing);
  }

  onSaveAnswers() {
    this.isEditing = false;
    this.editingChange.emit(this.isEditing);
    this.saveAnswers.emit();
  }

  sanitizeInput(input: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(input);
  }

  updateQuestionAnswer(index: number, event: any) {
    const answer = (event.target as HTMLElement)?.textContent ?? '';
    this.questionUpdated.emit({ index, answer });
  }

  // Check if a question has been answered
  hasAnswer(answer: any): boolean {
    if (!answer) {
      return false;
    }
    
    const answerStr = String(answer).trim();
    return answerStr !== '' && answerStr !== 'undefined' && answerStr !== 'null';
  }

  // Check if any questions have been answered
  hasAnyAnswers(): boolean {
    if (!this.profileQuestions || this.profileQuestions.length === 0) {
      return false;
    }
    
    return this.profileQuestions.some(questionObj => this.hasAnswer(questionObj.answer));
  }

  // Get the appropriate unanswered text based on context
  getUnansweredText(): string {
    if (this.isOwner) {
      return 'Click "Edit Answers" to add your response';
    } else {
      return 'Not answered yet';
    }
  }

  // Getter to safely access profile questions
  get profileQuestions() {
    return this.userProfile?.profileQuestions || [];
  }
}