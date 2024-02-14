import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';
import { Region } from '../../interfaces/region.type';


@Component({
  selector: 'countries-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit {

   countries: Country[] = []
   regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
   selectedRegion?: Region
   isLoading: boolean = false


   constructor(private countriesService: CountriesService) { }

   ngOnInit(): void {
      this.countries = this.countriesService.cacheStorage.byRegion.countries
      this.selectedRegion = this.countriesService.cacheStorage.byRegion.region
   }
    searchByRegion(term: Region) {

      this.isLoading = true
      this.selectedRegion = term

       this.countriesService.searchRegion(term)
        .subscribe(countries => {
          this.countries = countries
          this.isLoading = false
        })
    }
}
