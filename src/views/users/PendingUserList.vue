<template>
<FilteredUserList :invited="false" :email_verified="null"></FilteredUserList>
</template>

<script>
import FilteredUserList from "@/components/FilteredUserList";
export default {
    name: "PendingUserList",
    components: {FilteredUserList,},
    
}
</script>
