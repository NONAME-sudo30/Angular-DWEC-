import { Component, signal, computed } from '@angular/core';

interface Contacto {
  id: number;
  nombre: string;
  grupo: string;
  telefono: string;
  correo: string;
  favorito: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  contactos = signal<Contacto[]>([]);
  busqueda = signal('');

  constructor() {
    this.cargar();
  }

  async cargar() {
    const respuesta = await fetch('/contactos.json');
    this.contactos.set(await respuesta.json());
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  cambiarFavorito(id: number) {
    this.contactos.update(lista =>
      lista.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c)
    );
  }

  numFavoritos = computed(() => this.contactos().filter(c => c.favorito).length);

  filtrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    return this.contactos().filter(c => c.nombre.toLowerCase().includes(texto));
  });
}