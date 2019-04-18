<template>
<FilteredUserList email_verified="False"></FilteredUserList>
</template>

<script>
import FilteredUserList from "@/components/FilteredUserList";
export default {
    name: "PendingUserList",
    components: {FilteredUserList,},
    
}
</script>
