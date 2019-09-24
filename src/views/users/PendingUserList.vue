<template>
<FilteredUserList :invited="false"></FilteredUserList>
</template>

<script>
import FilteredUserList from "@/components/FilteredUserList";
export default {
    name: "PendingUserList",
    components: {FilteredUserList,},
    
}
</script>
