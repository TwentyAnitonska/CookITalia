<template>
  <section class="hero-section py-5 my-4" id="home">
    <div class="container">
      <div class="row align-items-center flex-column-reverse flex-lg-row hero-layout">
        <div class="col-lg-6 mb-4 mb-lg-0 hero-copy">
          <h1 class="display-4 fw-bold mb-3">
            Welcome to <br>
            <span class="hero-brand"><span class="hero-logo-cook">Cook</span><span class="hero-logo-it">IT</span><span class="hero-logo-alia">alia</span></span>
          </h1>
          <p class="mb-3 hero-text">This website was created by an Italian to help you avoid colossal mistakes like putting pineapple on pizza!</p>
          <p class="mb-0 hero-text">Explore the true magic of Italian cuisine. Find the best recipes, from great classics to tasty discoveries, and bring the flavor of Italy to your table.</p>
        </div>
        
        <div class="col-lg-6 position-relative">
          <div class="hero-image-wrapper rounded-4 overflow-hidden shadow-lg position-relative">
            <img :src="heroImage" alt="Piatti Italiani Famosi" class="img-fluid w-100 object-fit-cover" style="height: 450px;">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import heroImage from '../assets/italian_food_hero.png';
</script>

<style scoped>
.hero-section {
  background: transparent;
}
.hero-layout {
  /* Aumentato a 6rem per dare quel tocco di distanza in più su desktop */
  --bs-gutter-x: 6rem; 
}
.hero-copy {
  /* Aggiunto un po' di padding-right per evitare che il testo si avvicini troppo al centro */
  padding-right: 2.5rem;
}
/* Mantenuto il tuo stile unico e pulito per entrambi i paragrafi */
.hero-text {
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  line-height: 2.2;
}
.hero-brand {
  font-weight: 700;
}
.hero-logo-cook {
  color: var(--color-green);
}
.hero-logo-it {
  color: var(--color-white-logo);
  -webkit-text-stroke: 1px #000000;
}
.hero-logo-alia {
  color: var(--color-red);
}

:global(.app-container.app-dark) .hero-logo-cook {
  color: var(--color-green);
}

:global(.app-container.app-dark) .hero-logo-it {
  color: var(--color-white-logo);
  -webkit-text-stroke: 0 transparent;
}

:global(.app-container.app-dark) .hero-logo-alia {
  color: var(--color-red);
}

@media (max-width: 991.98px) {
  .hero-layout {
    /* Sul mobile manteniamo una distanza standard per non rompere il layout */
    --bs-gutter-x: 1.5rem;
  }
  .hero-copy {
    padding-right: 0;
  }
}
</style>
