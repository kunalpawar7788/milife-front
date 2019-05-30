<template>
  <pdf :src="source" :page="1">
    <template slot="loading">
      loading content here...
    </template>
  </pdf>
</template>

<script>
import pdf from 'pdfvuer'

export default {
data() {
return {
source: "/home/anuvrat/Documents/clients/lff-fitness/lff-proposal.pdf",
}
},
  components: {
    pdf
  }
}
</script>
