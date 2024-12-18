# app/services/file_parser_service.rb
class FileParserService
  def initialize(file)
    @file_path = file&.file
  end

  ##
  # Return the records objects to be created in Worker
  # @return Object[]
  def parse
    name, result =
                  case File.extname(@file_path)
                  when '.csv' then parse_csv
                  when '.xls' then parse_xls
                  when '.xlsx' then parse_xlsx
                  when '.xml' then parse_xml
                  when '.json' then parse_json
                  else
                    raise "Unsupported file format: #{File.extname(@file_path)}"
                  end

    [name, result]
  end

  private
  ##
  # Get all headers of spreadsheet
  # @param spreadsheet Object
  # @param row Integer
  # @return Object
  def get_headers(spreadsheet, row)
    return nil if spreadsheet.nil? || row.nil?

    headers = spreadsheet.row(row)
    headers.map { |h| h.to_s.strip.gsub(' ', '_').downcase.to_sym }
  end

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
  end

  def parse_xlsx
    require 'roo'
    spreadsheet = open_spreadsheet('xlsx')
    name = get_headers(spreadsheet, 1)
    headers = get_headers(spreadsheet, 2)

    result = []

    return {} unless headers.present?

    # We are assuming Item name is the first row
    # And the second one is all headers
    object_name = name.select(&:present?).join(' ')

    (3..spreadsheet.last_row).each do |i|
      row = spreadsheet.row(i)

      next if row.compact.blank? # Skip blank rows

      data = {}
      headers.each_with_index do |_value, index|
        data[headers[index].to_sym] = row[index] if row[index].present?
      end

      result << data
    end

    [object_name, result]
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
