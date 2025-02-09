<template>
     <div class="flex flex-1 flex-col gap-4 p-4">
        <Card class="relative overflow-hidden rounded-lg xl:col-span-2">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>Fichiers</CardTitle>
            <CardDescription>
              Liste des fichiers dans le chemin S3 de la configuration.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          
        <ListBackups :download="true" />
          </CardContent>
          <BorderBeam :size="250" :duration="12" :delay="0" :border-width="2" colorFrom="#ffaa40" colorTo="#9c40ff" />
        </Card>

      </div>
</template>