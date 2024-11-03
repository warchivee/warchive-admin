<script lang="ts">
  import ArrowIcon from "lucide-svelte/icons/chevron-right";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="flex flex-col items-center p-8">
  <img
    class="mb-8"
    src="https://www.womynarchive.com/images/logo/sh-logo.png"
    alt="warchive-logo"
  />

  <p class="text-gray-600 max-w-3xl mb-12">
    와카이브는 정기적으로 두 달에 한 번 데이터를 업데이트하고 있습니다. 팀
    내에서 논의된 데이터 업데이트 전날까지 아래 지침에 따라 검수를 완료해주세요.
  </p>

  <div
    class="w-full max-w-4xl flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0"
  >
    <a
      href="https://www.womynarchive.com/about"
      target="_blank"
      class="flex-1 bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg hover:bg-gray-50 border border-gray-200"
    >
      <h3 class="flex items-center text-lg font-semibold text-gray-800 mb-2">
        와카이브 내 여성서사 기준
        <ArrowIcon class="pt-1 text-gray-600" />
      </h3>
      <p class="text-gray-600 text-sm">
        사용자들에게 공개하는 와카이브 내 여성서사 검수 기준입니다.
      </p>
    </a>

    <a
      href="https://docs.google.com/document/d/1aFP2wQ3rbUMDecor9h4HDtKiMx9IUcHPKdfJRkcC2w4/edit?usp=sharing"
      target="_blank"
      class="flex-1 bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg hover:bg-gray-50 border border-gray-200"
    >
      <h3 class="flex items-center text-lg font-semibold text-gray-800 mb-2">
        검수 가이드
        <ArrowIcon class="pt-1 text-gray-600" />
      </h3>
      <p class="text-gray-600 text-sm">
        사용자들에게 공개하지 않는 검수 기준입니다. 검수 도중 궁금하신 점이
        있다면 질문 전에 데이터 검수 가이드를 꼭 정독해주세요.
      </p>
    </a>
  </div>
</div>
