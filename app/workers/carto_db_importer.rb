class CartoDbImporter
  @queue = :carto_table_import
  def self.perform(data_layer_id)
    layer = DataLayer.find(data_layer_id)

    queue_id = CartoDb.upload(File.open(layer.shapefile.path))
    sleep(10)
    import_status = CartoDb.import_status(queue_id)
    i = 0
    while i < 120
      break if import_status["state"] == "complete"
      sleep(60)
      import_status = CartoDb.import_status(queue_id)
      i += 1
    end
    layer.import_status = import_status["state"]
    layer.table_name = import_status['table_name']
    layer.save
  end
end
