class CreateChartsPages < ActiveRecord::Migration
  def change
    create_table :charts_pages do |t|
      t.belongs_to :chart, index: true
      t.belongs_to :page, index: true
    end
  end
end
