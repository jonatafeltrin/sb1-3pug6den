import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#121A78',
    fontSize: 24,
    fontWeight: '400',
  },
  badge: {
    borderWidth: 1,
    borderColor: '#C6C6C6',
    height: 32,
    marginRight: 8,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: '#2E3DE0',
  },
  badgeText: {
    color: '#000',
    fontSize: 16,
    paddingHorizontal: 16,
  },
  badgeTextActive: {
    color: '#FFF',
  },
  titleItem: {
    color: '#121A78',
    fontSize: 16,
    fontWeight: '600',
  },
  textItem: {
    color: '#393939',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '400',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'flex-end',
  },
  checkboxDate: {
    fontSize: 12,
  },
});
