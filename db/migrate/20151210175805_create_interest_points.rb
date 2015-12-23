class CreateInterestPoints < ActiveRecord::Migration
  def change
    create_table :interest_points do |t|
      t.string :name, null: false
      t.with_options precision: 15, scale: 10, null: false do |c|
        c.decimal :lat
        c.decimal :lng
      end
      t.float :radius
      
      t.belongs_to :page, index: true, null: false

      t.timestamps null: false
    end
  end
end
