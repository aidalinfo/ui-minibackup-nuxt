<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl leading-none">
            Tableau de bord</h2>
      <NextBackup/>
      <RStorageEnable/>

    </div>
    <div class="grid gap-4 md:gap-8">
      <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
        <CardHeader class="flex flex-row items-center justify-between">
          <div class="grid gap-2">
            <CardTitle>Sauvegardes</CardTitle>
            <CardDescription>
              Résumé des sauvegardes actives.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <ListBackupsElements />
        </CardContent>
      </Card>
      <div>
    </div>
    </div>
  </main>
</template>