<script lang="ts">
  import RadialGallery from "../lib/motion-core/radial-gallery/RadialGallery.svelte"

  import img1 from '../assets/images/Image1.webp';
  import img2 from '../assets/images/Image2.webp';
  import img3 from '../assets/images/Image3.webp';
  import img4 from '../assets/images/Image4.webp';
  import img5 from '../assets/images/Image5.webp';
  import img6 from '../assets/images/Image6.webp';

  const images =[
    img1.src,
    img5.src,
    img2.src,
    img3.src,
    img4.src,
    img6.src
  ];
</script>

<div class="relative h-100 w-full overflow-hidden">
  <RadialGallery
    class="h-full w-full"
    items={images}
    radius={600}
    duration={70}
    offset={-400}
    gap={100}
    elementSize={160}
  >
    {#snippet children(item)}
      <div class="relative h-48 w-48 rounded-lg bg-zinc-800 p-1.5 shadow-xl transition-transform hover:scale-105">
        <div class="h-full w-full overflow-hidden rounded-md bg-black">
          <img src={item} class="h-full w-full object-cover" alt="Gallery item" />
        </div>
      </div>
    {/snippet}
  </RadialGallery>
</div>
