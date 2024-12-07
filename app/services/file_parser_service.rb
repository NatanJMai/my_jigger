# app/services/file_parser_service.rb
class FileParserService
  def initialize(file)
    @file_path = file&.file
    puts @file_path
  end

  ##
  # Return the records objects to be created in Worker
  # @return Object[]
  def parse
    debugger
    case File.extname(@file_path)
    when '.csv' then parse_csv
    when '.xls' then parse_xls
    when '.xlsx' then parse_xlsx
    when '.xml' then parse_xml
    when '.json' then parse_json
    else
      raise "Unsupported file format: #{File.extname(@file_path)}"
    end
  end

  private

  # Open the spreadsheet using Roo
  # XLS & XLSX
  # @param type String
  def open_spreadsheet(type)
    case type
    when 'csv'
      Roo::CSV.new(@file_path)
    when 'xls'
      Roo::Excel.new(@file_path)
    when 'xlsx'
      Roo::Excelx.new(@file_path)
    else
      raise "Invalid spreadsheet format"
    end
  end

  def parse_xls
    require 'roo'

    spreadsheet = open_spreadsheet('xls')
    debugger
  end

  def parse_xlsx
    require 'roo'
    debugger
    spreadsheet = open_spreadsheet('xlsx')
  end

  def parse_csv
    require 'csv'
    spreadsheet = open_spreadsheet('csv')
    CSV.foreach(@file_path, headers: true).map(&:to_h)
  end

  def parse_xml
    require 'nokogiri'
    xml_doc = Nokogiri::XML(File.open(@file_path))
    xml_doc.xpath('//record').map do |node|
      {
        name: node.xpath('name').text,
        age: node.xpath('age').text.to_i
      }
    end
  end

  def parse_json
    require 'json'
    JSON.parse(File.read(@file_path))
  end
end
