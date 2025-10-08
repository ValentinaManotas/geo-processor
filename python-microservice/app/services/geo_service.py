from typing import List, Dict
from ..models.geo import Point

def process_geo_data(points: List[Point]) -> Dict:
    """
    Process the geo data to calculate the centroid and bounds.

    Args:
        points (List[Point]): List of geographical points (lat, lng).
    
    Returns:
        Dict: Calculated centroid and bounds.
    """

    north = max(point.lat for point in points)
    south = min(point.lat for point in points)
    east = max(point.lng for point in points)
    west = min(point.lng for point in points)
    
    centroid_lat = sum(p.lat for p in points) / len(points)
    centroid_lng = sum(p.lng for p in points) / len(points)

    return {
        "centroid": {"lat": centroid_lat, "lng": centroid_lng},
        "bounds": {"north": north, "south": south, "east": east, "west": west}
    }
