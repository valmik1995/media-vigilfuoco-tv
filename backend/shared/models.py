from django.db import models
from django.utils.text import slugify


class Regione(models.Model):
    nome = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Regioni"
        ordering = ['nome']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome


class Provincia(models.Model):
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=2, blank=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    regione = models.ForeignKey(
        Regione, on_delete=models.CASCADE, related_name='province')

    class Meta:
        verbose_name_plural = "Province"
        ordering = ['nome']

    def save(self, *args, **kwargs):
        if not self.slug:
            # Esempio: "Reggio Emilia RE" -> "reggio-emilia-re"
            self.slug = slugify(f"{self.nome} {self.sigla}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.sigla})"


class Comune(models.Model):
    nome = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    provincia = models.ForeignKey(
        Provincia, on_delete=models.CASCADE, related_name='comuni')
    codice_istat = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Comuni"
        ordering = ['nome']

    def save(self, *args, **kwargs):
        if not self.slug:
            # Aggiungiamo la sigla allo slug del comune per evitare conflitti
            # tra comuni con lo stesso nome in province diverse (es. Castro)
            self.slug = slugify(f"{self.nome} {self.provincia.sigla}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.provincia.sigla})"
    

class Mezzo(models.Model):
    sigla = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)


    class Meta:
        verbose_name_plural = "Mezzi"
        ordering = ['sigla']

    def save(self, *args, **kwargs):
        if not self.slug:
            # Sostituiamo la barra "/" con un trattino "-" per lo slug
            self.slug = slugify(self.sigla.replace('/', '-'))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sigla} - {self.nome}"
    

class TipologiaIntervento(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Genera lo slug dal nome (es: "Fuga gas" -> "fuga-gas")
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Tipologia Intervento"
        verbose_name_plural = "Tipologie Interventi"

    def __str__(self):
        return self.name


class Tags(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']

    def __str__(self):
        return self.name


class Specializzazione(models.Model):
    nome = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    # Campo per la gerarchia: punta a un'altra istanza di Specializzazione
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    class Meta:
        verbose_name_plural = "Specializzazioni"
        # Evita duplicati sotto lo stesso padre
        unique_together = ('nome', 'parent')

    def __str__(self):
        return f"{self.parent.nome} > {self.nome}" if self.parent else self.nome


class Etichette(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Etichetta"
        verbose_name_plural = "Etichette"

    def __str__(self):
        return self.nome
