<template>
  <div class="deep-research-feature">
    <div class="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 mb-6">
      <h2 class="text-xl mb-2 text-cyan-300 font-pixelated">
        <span class="text-green-400">&#x25B6;</span> Tính năng nghiên cứu chuyên sâu
      </h2>
      <p class="text-gray-300 mb-4">
        Chuyên gia Giáo sư Đạt Vân Tây sử dụng công nghệ tìm kiếm web thông minh và khả năng phân tích tài liệu để cung
        cấp thông tin chính xác và toàn diện.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">Tìm kiếm web tự động</h3>
          <p class="text-gray-300 text-sm">
            Tự động tìm kiếm web để lấy thông tin mới nhất và đáng tin cậy về chủ đề của bạn.
          </p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">Phân tích nhiều nguồn</h3>
          <p class="text-gray-300 text-sm">Tổng hợp thông tin từ nhiều nguồn để cung cấp cái nhìn toàn diện.</p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">Tóm tắt thông minh</h3>
          <p class="text-gray-300 text-sm">Chuyển đổi thông tin phức tạp thành hiểu biết rõ ràng, dễ hiểu.</p>
        </div>
        <div class="bg-gray-700 p-3 rounded border border-gray-500">
          <h3 class="text-yellow-300 mb-2 font-pixelated">Kiểm chứng sự thật</h3>
          <p class="text-gray-300 text-sm">Xác minh thông tin từ nhiều nguồn để đảm bảo độ tin cậy.</p>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <PixelButton
          class="text-green-300"
          text="Thử ngay với Giáo sư Đạt Vân Tây"
          :router-link="{ name: 'chat', query: { agent: 'deepResearchAgent' } }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component for showcasing the Deep Research feature
</script>

<style scoped>
.font-pixelated {
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 0.9em;
}
</style>
