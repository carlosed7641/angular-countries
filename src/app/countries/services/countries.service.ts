import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, map, of, tap } from 'rxjs'
import { Country } from '../interfaces/country.interface'
import { CacheStore } from '../interfaces/cache-store.interface'
import { Region } from '../interfaces/region.type'

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl = 'https://restcountries.com/v3.1'

  cacheStorage: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] }
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStore()
  }

  private saveToLocalStore(): void {
    localStorage.setItem('cacheStorage', JSON.stringify(this.cacheStorage))
  }

  private loadFromLocalStore(): void {
    if (localStorage.getItem('cacheStorage')) {
      this.cacheStorage = JSON.parse(localStorage.getItem('cacheStorage') as string)
    }
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(() => of([])),
        // delay(2000)
      )

  }

  searchByCountryCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`

    return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null))
      )
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStorage.byCapital = { term, countries }),
        tap(() => this.saveToLocalStore())
      )
  }

  searchRegion(term: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${term}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStorage.byRegion = { region: term, countries }),
        tap(() => this.saveToLocalStore())
      )

  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStorage.byCountry = { term, countries }),
        tap(() => this.saveToLocalStore())
      )
  }

}
