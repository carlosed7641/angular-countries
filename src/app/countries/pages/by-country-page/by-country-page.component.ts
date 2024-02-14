import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'countries-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent implements OnInit {

  countries: Country[] = []
  isLoading: boolean = false
  initialValue: string = ""

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStorage.byCountry.countries
    this.initialValue = this.countriesService.cacheStorage.byCountry.term
  }

  constructor(private countriesService: CountriesService) { }

  searchByCountry(term: string) {

    this.isLoading = true

    this.countriesService.searchCountry(term)
      .subscribe(countries => {
        this.countries = countries
        this.isLoading = false
      })
  }
}
