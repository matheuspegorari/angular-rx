import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  switchMap
} from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';
import { Item, LivrosResultado } from './../../models/interfaces';

const DEBOUNCE = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  constructor(private service: LivroService) {}

  // totalDeLivros$ = this.campoBusca.valueChanges.pipe(
  //   debounceTime(DEBOUNCE),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map((resultado) => (this.livrosResultado = resultado)),
  //   catchError((error) => {
  //     console.log(error);
  //     return of();
  //   })
  // );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(DEBOUNCE),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    map((resultado) => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError(() => {
      this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação!';
      return EMPTY;
    })
  );

  // .subscribe(data => this.config = {
  //   heroesUrl: (data as any).heroesUrl,
  //   textfile: (data as any).textfile
  // });

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
