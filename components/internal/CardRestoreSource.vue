<script setup lang='ts'>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


const props = defineProps<{
  Title: string
  Description: string
}>();

</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>{{ props.Title }}</CardTitle>
      <CardDescription>{{ props.Description }}</CardDescription>
    </CardHeader>
    <CardContent>
        <slot name="content"></slot>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>