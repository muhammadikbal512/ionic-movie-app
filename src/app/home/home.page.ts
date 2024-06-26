import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonAlert,
  IonLabel,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading,
  IonSearchbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/movie.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowUp, arrowUpSharp } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonSkeletonText,
    IonAlert,
    IonLabel,
    DatePipe,
    RouterModule,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLoading,
    IonSearchbar,
    IonButton,
    IonIcon,
    CommonModule
  ],
})
export class HomePage {
  private movieService = inject(MovieService);

  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  originalMovies: MovieResult[] = [];
  showScrollButton: boolean = false;
  public imageBaseUrl = 'https:image.tmdb.org/t/p';

  test: string = '';

  public dummyArray = new Array(5);

  constructor() {
    addIcons({ arrowUp, arrowUpSharp });
    this.loadMovies();
  }

  searchMovie(event: any) {
    const searchTerm = event.detail.value.toLowerCase();

    // Filter movies based on the search term
    this.movies = this.originalMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm)
    );
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService
      .getTopRatedMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          console.log(err);
          this.error = err.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.movies.push(...res.results);
          this.originalMovies = res.results;
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });
  }

  loadMore(event?: InfiniteScrollCustomEvent) {
    this.currentPage += 1;
    this.showScrollButton = true;
    this.loadMovies(event);
  }

  
}
